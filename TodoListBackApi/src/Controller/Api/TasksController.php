<?php

namespace App\Controller\Api;

use App\Entity\Tasks;
use App\Repository\TasksRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

    /**
     * @Route("/api/tasks", name="api_tasks_")
     */
class TasksController extends AbstractController
{

    /**
    * @Route("/", name="browse", methods={"GET"})
    */
    public function loadTaskList(TasksRepository $tasksRepository, SerializerInterface $serializer)
    {
        

        $tasksList = $serializer->normalize($tasksRepository->findAll(), null, ['groups' => 'task']);

        return $this->json([
            'tasksList' => $tasksList,
        ]);
    }





    /**
     * @Route("/", name="add", methods={"POST"})
     */
    public function addTask(Request $request)
    {
        // On instancie un nouvel article
        $tasks = new Tasks();

     
        
        // On décode les données envoyées
        $donnees = json_decode($request->getContent());
    
       
        // On hydrate l'objet
        $tasks->setTitle($donnees->title);
        $tasks->setCompletion($donnees->completion);
        $tasks->setStatus($donnees->status);
        $tasks->setCategory($donnees->category);
        
        // On sauvegarde en base
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->persist($tasks);
        $entityManager->flush();

        // On retourne la confirmation
        return new Response('ok', 201);
        }
}
