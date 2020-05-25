<?php

namespace App\Controller\Api;

use App\Entity\Categories;
use App\Form\CategoriesType;
use App\Repository\CategoriesRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

    /**
     * @Route("/api/categories", name="api_categories_")
     */

class CategoriesController extends AbstractController
{

    /**
    * @Route("/", name="browse", methods={"GET"})
    */
    public function index(CategoriesRepository $categoriesRepository, SerializerInterface $serializer)
    {
        $categories = $serializer->normalize($categoriesRepository->findAll(), null, ['groups' => 'category']);

        return $this->json([
            'categories' => $categories,
        ]);
    }
 

    /**
    * @Route("/", name="add", methods={"POST"})
    */
    public function add(Request $request,  SerializerInterface $serializer)
    {

        $data = json_decode($request->getContent(), true);

        $category = new Categories();

        $form = $this->createForm(CategoriesType::class, $category);
        $form->submit($data);

        if ($form->isSubmitted() && $form->isValid()) {

            $em = $this->getDoctrine()->getManager();

            $em->persist($category);
            $em->flush();
        }

        $newCategory = $serializer->normalize($category, null, ['groups' => 'category']);
        
        return $this->json(
            [ 'categories' => $newCategory,],
            $status = 201,
            $headers = ['content-type' => 'application/Json'],
            $context = []
        );
    }
    
    /**
    * @Route("/{id}", name="delete")
    */
    public function delete()
    {
        return $this->json([
            'message' => 'Welcome to your new controller!',
            'path' => 'src/Controller/Api/TasksController.php',
        ]);
    }
}